import { ClientConnection } from '@sourcegraph/extensions-client-common/lib/messaging'
import DirectionalSignIcon from '@sourcegraph/icons/lib/DirectionalSign'
import * as GQL from '@sourcegraph/webapp/dist/backend/graphqlschema'
import { HeroPage } from '@sourcegraph/webapp/dist/components/HeroPage'
import { ExtensionsAreaRouteContext } from '@sourcegraph/webapp/dist/extensions/ExtensionsArea'
import { ExtensionsProps } from '@sourcegraph/webapp/dist/extensions/ExtensionsClientCommonContext'
import * as React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { Subject, Subscription } from 'rxjs'
import { RegistryNewExtensionPage } from './RegistryNewExtensionPage'

const NotFoundPage = () => <HeroPage icon={DirectionalSignIcon} title="404: Not Found" />

interface Props extends RouteComponentProps<{}>, ExtensionsAreaRouteContext {}

/**
 * Properties passed to all page components in the registry area.
 */
export interface RegistryAreaPageProps extends ExtensionsProps {
    /** The currently authenticated user. */
    authenticatedUser: GQL.IUser | null
    clientConnection: Promise<ClientConnection>
}

/**
 * The extension registry area.
 */
export class RegistryArea extends React.Component<Props> {
    private componentUpdates = new Subject<Props>()
    private subscriptions = new Subscription()

    public componentDidMount(): void {
        this.componentUpdates.next(this.props)
    }

    public componentWillReceiveProps(props: Props): void {
        this.componentUpdates.next(props)
    }

    public componentWillUnmount(): void {
        this.subscriptions.unsubscribe()
    }

    public render(): JSX.Element | null {
        const transferProps: RegistryAreaPageProps = {
            authenticatedUser: this.props.authenticatedUser,
            extensions: this.props.extensions,
            clientConnection: this.props.clientConnection,
        }

        return (
            <div className="registry-area area--vertical">
                <Switch>
                    <Route
                        path={`${this.props.match.url}/new`}
                        key="hardcoded-key" // see https://github.com/ReactTraining/react-router/issues/4578#issuecomment-334489490
                        exact={true}
                        // tslint:disable-next-line:jsx-no-lambda
                        render={routeComponentProps => (
                            <RegistryNewExtensionPage {...routeComponentProps} {...transferProps} />
                        )}
                    />
                    <Route key="hardcoded-key" component={NotFoundPage} />
                </Switch>
            </div>
        )
    }
}